const PROVIDER = 'github';
const AUTH_URL = 'https://github.com/login/oauth/authorize';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';

const DEFAULT_SCOPE = 'repo,user';
const ALLOWED_SCOPES = ['repo', 'public_repo', 'user', 'read:user', 'user:email'];

const ERROR_MESSAGES = {
  unsupported_backend: 'Your Git backend is not supported by the authenticator.',
  unsupported_domain: 'Your domain is not allowed to use the authenticator.',
  misconfigured_client: 'GitHub client ID or secret is not configured.',
  auth_code_request_failed: 'Failed to receive an authorization code. Please try again later.',
  csrf_detected: 'Potential CSRF attack detected. Authentication flow aborted.',
  token_request_failed: 'Failed to request an access token. Please try again later.',
};

const serialize = (value) => JSON.stringify(value ?? null).replaceAll('<', '\\u003c');

function domainPatterns(env) {
  return (env.ALLOWED_DOMAINS || '')
    .split(',')
    .map((str) => str.trim())
    .filter(Boolean)
    .map(
      (str) =>
        new RegExp(
          `^${str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replaceAll('\\*', '.+')}$`,
        ),
    );
}

function isAllowedHostname(hostname, patterns) {
  return !patterns.length || patterns.some((pattern) => pattern.test(hostname));
}

function resultHTML({ env, token, error, errorCode }) {
  const status = error ? 'error' : 'success';
  const content = error ? { provider: PROVIDER, error, errorCode } : { provider: PROVIDER, token };
  const handshake = `authorizing:${PROVIDER}`;
  const message = `authorization:${PROVIDER}:${status}:${JSON.stringify(content)}`;
  const patterns = domainPatterns(env).map((pattern) => pattern.source);

  const body = `<!doctype html><html><head><meta charset="utf-8"><title>Authentication</title></head><body><script>
(function () {
  var patterns = ${serialize(patterns)};
  var hasToken = ${serialize(!!token)};
  var handshake = ${serialize(handshake)};
  var message = ${serialize(message)};
  function isTrusted(origin) {
    try {
      var hostname = new URL(origin).hostname;
      return patterns.some(function (pattern) { return new RegExp(pattern).test(hostname); });
    } catch (e) { return false; }
  }
  window.addEventListener('message', function (e) {
    if (e.data !== handshake) return;
    if (hasToken && patterns.length && !isTrusted(e.origin)) return;
    if (window.opener) window.opener.postMessage(message, e.origin);
  });
  if (window.opener) window.opener.postMessage(handshake, '*');
})();
</script><p>${error ? `Authentication failed: ${error}` : 'Authentication succeeded. You can close this window.'}</p></body></html>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': `csrf-token=deleted; HttpOnly; Max-Age=0; Path=/; SameSite=Lax; Secure`,
    },
  });
}

function errorHTML(code, env) {
  return resultHTML({ env, error: ERROR_MESSAGES[code], errorCode: code });
}

function clientConfigured(env) {
  return Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);
}

function resolveScope(requested) {
  const scopes = (requested || '').split(/[\s,]+/).filter(Boolean);
  return scopes.length && scopes.every((scope) => ALLOWED_SCOPES.includes(scope))
    ? scopes.join(',')
    : DEFAULT_SCOPE;
}

async function handleAuth(request, env) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');

  if (provider !== PROVIDER) {
    return resultHTML({
      env,
      error: ERROR_MESSAGES.unsupported_backend,
      errorCode: 'unsupported_backend',
    });
  }

  const site = searchParams.get('site_id') || '';
  if (!isAllowedHostname(site, domainPatterns(env))) {
    return errorHTML('unsupported_domain', env);
  }

  if (!clientConfigured(env)) {
    return errorHTML('misconfigured_client', env);
  }

  const state = crypto.randomUUID().replaceAll('-', '');
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    scope: resolveScope(searchParams.get('scope')),
    state,
  });

  return new Response('', {
    status: 302,
    headers: {
      Location: `${AUTH_URL}?${params.toString()}`,
      'Set-Cookie':
        `csrf-token=${PROVIDER}_${state}; ` +
        `HttpOnly; Path=/; Max-Age=600; SameSite=Lax; Secure`,
    },
  });
}

async function handleCallback(request, env) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const cookie = request.headers.get('Cookie') || '';
  const [, csrfToken] =
    cookie.match(new RegExp(`\\bcsrf-token=${PROVIDER}_([0-9a-f]{32})\\b`)) ?? [];

  if (!code || !state) {
    return errorHTML('auth_code_request_failed', env);
  }

  if (!csrfToken || state !== csrfToken) {
    return errorHTML('csrf_detected', env);
  }

  if (!clientConfigured(env)) {
    return errorHTML('misconfigured_client', env);
  }

  let response;
  try {
    response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
  } catch {
    return errorHTML('token_request_failed', env);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    return errorHTML('token_request_failed', env);
  }

  if (!result?.access_token) {
    return resultHTML({
      env,
      error: result?.error_description || result?.error || ERROR_MESSAGES.token_request_failed,
      errorCode: 'token_request_failed',
    });
  }

  return resultHTML({ env, token: result.access_token });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (request.method === 'GET' && ['/auth', '/oauth/authorize'].includes(pathname)) {
      return handleAuth(request, env);
    }

    if (request.method === 'GET' && ['/callback', '/oauth/redirect'].includes(pathname)) {
      return handleCallback(request, env);
    }

    return new Response('Not Found', { status: 404 });
  },
};
