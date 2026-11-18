(function () {
  var template = `
  <div class="kafka-demo__title">Kafka 事件处理交互演示</div>
  <div class="kafka-demo__controls">
    <button type="button" data-action="produce">生成事件</button>
    <button type="button" data-action="consume">消费事件</button>
    <button type="button" data-action="process">处理事件</button>
    <button type="button" data-action="manage">管理事件</button>
    <button type="button" data-action="auto" class="kafka-demo__auto">自动演示</button>
    <button type="button" data-action="reset" class="kafka-demo__reset">重置</button>
  </div>

  <div class="kafka-demo__pipeline">
    <div class="kafka-demo__stage" data-stage="producer">
      <div class="kafka-demo__stage-icon">P</div>
      <div class="kafka-demo__stage-name">Producer</div>
      <div class="kafka-demo__stage-desc">生成事件</div>
    </div>
    <div class="kafka-demo__arrow">→</div>
    <div class="kafka-demo__stage" data-stage="topic">
      <div class="kafka-demo__stage-icon">T</div>
      <div class="kafka-demo__stage-name">Topic / Partition</div>
      <div class="kafka-demo__stage-desc" id="kafka-demo-topic-chip">orders-p0</div>
      <div class="kafka-demo__tokens" id="kafka-demo-tokens"></div>
    </div>
    <div class="kafka-demo__arrow">→</div>
    <div class="kafka-demo__stage" data-stage="consumer">
      <div class="kafka-demo__stage-icon">C</div>
      <div class="kafka-demo__stage-name">Consumer Group</div>
      <div class="kafka-demo__stage-desc">按 offset 拉取</div>
    </div>
    <div class="kafka-demo__arrow">→</div>
    <div class="kafka-demo__stage" data-stage="process">
      <div class="kafka-demo__stage-icon">S</div>
      <div class="kafka-demo__stage-name">Streams / Admin</div>
      <div class="kafka-demo__stage-desc">处理与管理</div>
    </div>
  </div>

  <div class="kafka-demo__panels">
    <div class="kafka-demo__metrics">
      <div><span>生成</span><strong id="kafka-demo-produced">0</strong></div>
      <div><span>消费</span><strong id="kafka-demo-consumed">0</strong></div>
      <div><span>处理</span><strong id="kafka-demo-processed">0</strong></div>
      <div><span>管理</span><strong id="kafka-demo-managed">0</strong></div>
      <div><span>Offset</span><strong id="kafka-demo-offset">0</strong></div>
      <div><span>Lag</span><strong id="kafka-demo-lag">0</strong></div>
    </div>
    <div class="kafka-demo__current">
      <div class="kafka-demo__panel-label">当前事件</div>
      <div id="kafka-demo-current" class="kafka-demo__current-value">尚未消费事件</div>
    </div>
  </div>

  <div class="kafka-demo__log-wrap">
    <div class="kafka-demo__panel-label">操作日志</div>
    <div id="kafka-demo-log" class="kafka-demo__log"></div>
  </div>
  `;

  function boot() {
    var mount = document.getElementById('kafka-demo');
    if (!mount || mount.dataset.kafkaDemoReady) return;
    mount.dataset.kafkaDemoReady = '1';
    mount.classList.add('kafka-demo');
    mount.innerHTML = template;

    var autoBtn = mount.querySelector('[data-action="auto"]');
    var state = {
      seq: 0, produced: 0, consumed: 0, processed: 0, managed: 0,
      offset: 0, lag: 0, queue: [], current: null, timer: null, running: false
    };

    function byId(name) { return document.getElementById('kafka-demo-' + name); }
    function log(msg) {
      var d = new Date();
      var ts = d.toTimeString().slice(0, 8);
      byId('log').textContent = '[' + ts + '] ' + msg + '\n' + byId('log').textContent;
    }
    function activate(stage) {
      mount.querySelectorAll('.kafka-demo__stage').forEach(function (node) {
        node.classList.toggle('is-active', node.getAttribute('data-stage') === stage);
      });
    }
    function metrics() {
      byId('produced').textContent = state.produced;
      byId('consumed').textContent = state.consumed;
      byId('processed').textContent = state.processed;
      byId('managed').textContent = state.managed;
      byId('offset').textContent = state.offset;
      byId('lag').textContent = state.lag;
    }
    function renderTokens() {
      var box = byId('tokens');
      box.innerHTML = '';
      state.queue.slice(-4).forEach(function (event) {
        var chip = document.createElement('span');
        chip.className = 'kafka-demo__token';
        chip.textContent = event.id + '/p' + event.partition;
        box.appendChild(chip);
      });
    }
    function renderCurrent() {
      var node = byId('current');
      if (!state.current) {
        node.textContent = '尚未消费事件';
        return;
      }
      var event = state.current;
      node.innerHTML = '<strong>' + event.id + '</strong> · orders-p' + event.partition + ' · offset=' + event.offset +
        '<br><span>' + (event.result ? event.value + ' → ' + event.result : event.value + '（待处理）') + '</span>';
    }
    function reset(message) {
      clearTimeout(state.timer);
      state.running = false;
      autoBtn.disabled = false;
      state.seq = 0;
      state.produced = 0;
      state.consumed = 0;
      state.processed = 0;
      state.managed = 0;
      state.offset = 0;
      state.lag = 0;
      state.queue = [];
      state.current = null;
      byId('log').textContent = '';
      byId('topic-chip').textContent = 'orders-p0';
      renderTokens();
      renderCurrent();
      metrics();
      activate(null);
      log(message || '演示已重置，点击「生成事件」开始');
    }
    function produce() {
      state.seq += 1;
      var id = 'evt-' + ('000' + state.seq).slice(-3);
      var partition = state.seq % 3;
      var event = {
        id: id,
        partition: partition,
        offset: state.offset,
        value: 'order-' + state.seq,
        result: null
      };
      state.offset += 1;
      state.queue.push(event);
      state.produced += 1;
      state.lag += 1;
      byId('topic-chip').textContent = 'orders-p' + partition;
      renderTokens();
      metrics();
      activate('producer');
      log('Producer 发送 ' + id + ' → orders-p' + partition + '，offset=' + event.offset + '，lag=' + state.lag);
    }
    function consume() {
      if (!state.queue.length) {
        activate('consumer');
        log('暂无可消费事件，请先点击「生成事件」');
        return;
      }
      var event = state.queue.shift();
      state.current = event;
      state.consumed += 1;
      state.lag = Math.max(0, state.lag - 1);
      renderTokens();
      renderCurrent();
      metrics();
      activate('consumer');
      log('Consumer Group 拉取 ' + event.id + '，partition=' + event.partition + '，offset=' + event.offset + '，lag=' + state.lag);
    }
    function process() {
      if (!state.current) {
        activate('process');
        log('请先点击「消费事件」');
        return;
      }
      var event = state.current;
      event.result = event.value.toUpperCase() + '-PROCESSED';
      state.processed += 1;
      renderCurrent();
      metrics();
      activate('process');
      log('Streams 处理 ' + event.id + '：' + event.value + ' → ' + event.result);
    }
    function manage() {
      if (!state.current) {
        activate('process');
        log('请先点击「消费事件」');
        return;
      }
      var event = state.current;
      state.managed += 1;
      metrics();
      activate('process');
      log('Admin 管理 orders-p' + event.partition + '：提交 offset=' + (event.offset + 1) + '，retention=7d，ACL=read/write');
    }
    function auto() {
      if (state.running) return;
      state.running = true;
      autoBtn.disabled = true;
      var steps = [produce, consume, process, manage];
      var index = 0;
      function next() {
        if (index >= steps.length) {
          state.running = false;
          autoBtn.disabled = false;
          log('自动演示完成');
          return;
        }
        steps[index++]();
        state.timer = setTimeout(next, 900);
      }
      next();
    }

    mount.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-action]');
      if (!button) return;
      var action = button.getAttribute('data-action');
      if (action === 'produce') produce();
      else if (action === 'consume') consume();
      else if (action === 'process') process();
      else if (action === 'manage') manage();
      else if (action === 'auto') auto();
      else if (action === 'reset') reset();
    });

    reset('点击「生成事件」或「自动演示」开始');
  }

  if (window.document$) {
    window.document$.subscribe(boot);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
