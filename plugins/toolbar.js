const deepMix = require('@antv/util/lib/deep-mix');
const each = require('@antv/util/lib/each');
const wrapBehavior = require('@antv/util/lib/event/wrap-behavior');
const modifyCSS = require('@antv/util/lib/dom/modify-css');

class Toolbar {
  constructor(cfgs) {
    this._cfgs = deepMix(this.getDefaultCfg(), cfgs);
  }

  getDefaultCfg() {
    return { container: null };
  }

  get(key) {
    return this._cfgs[key];
  }

  set(key, val) {
    this._cfgs[key] = val;
  }

  initPlugin(graph) {
    const self = this;
    this.set('graph', graph);
    const events = self.getEvents();
    const bindEvents = {};
    each(events, (v, k) => {
      const event = wrapBehavior(self, v);
      bindEvents[k] = event;
      graph.on(k, event);
    });
    this._events = bindEvents;

    this.initEvents();
    this.updateToolbar();
  }

  getEvents() {
    return { afteritemselected: 'updateToolbar', aftercommandexecute: 'updateToolbar' };
  }

  initEvents() {
    const graph = this.get('graph');
    const parentNode = this.get('container');
    const children = parentNode.querySelectorAll('div > div[data-command]');
    each(children, (child, i) => {
      const cmdName = child.getAttribute('data-command');
      child.addEventListener('click', (e) => {
        graph.commandEnable(cmdName) && graph.executeCommand(cmdName);
      });
    });
  }

  updateToolbar() {
    const graph = this.get('graph');
    const parentNode = this.get('container');
    const children = parentNode.querySelectorAll('div > div[data-command]');
    each(children, (child, i) => {
      const cmdName = child.getAttribute('data-command');
      if (graph.commandEnable(cmdName)) {
        modifyCSS(child, {
          cursor: 'pointer',
        });
        modifyCSS(child.children[0], {
          filter: 'drop-shadow(rgba(255, 255, 255, 1)  80px 0)',
          position: 'relative',
          left: '-80px',
        });
      } else {
        modifyCSS(child, {
          cursor: 'default',
        });
        modifyCSS(child.children[0], {
          filter: 'drop-shadow(rgba(255, 255, 255, 0.4)  80px 0)',
          position: 'relative',
          left: '-80px',
        });
      }
    });
  }

  destroyPlugin() {
    this.get('canvas').destroy();
    const container = this.get('container');
    container.parentNode.removeChild(container);
  }
}

export default Toolbar;
