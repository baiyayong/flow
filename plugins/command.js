const mix = require('@antv/util/lib/mix');
const clone = require('@antv/util/lib/clone');
const isString = require('@antv/util/lib/type/is-string');

class Command {
  constructor() {

  }

  getDefaultCfg() {
    return {
      _command: {
        zoomDelta: 0.1, queue: [], current: 0, clipboard: [],
      },
    };
  }

  get(key) {
    return this._cfgs[key];
  }

  set(key, val) {
    this._cfgs[key] = val;
  }

  initPlugin(graph) {
    this._cfgs = this.getDefaultCfg();
    this.list = [];
    this.queue = [];
    this.initCommands();
    graph.getCommands = () => this.get('_command').queue;
    graph.getCurrentCommand = () => {
      const c = this.get('_command');
      return c.queue[c.current - 1];
    };
    graph.executeCommand = (name, cfg) => { this.execute(name, graph, cfg); };
    graph.commandEnable = name => this.enable(name, graph);
  }

  registerCommand(name, cfg) {
    if (this[name]) {
      mix(this[name], cfg);
    } else {
      const cmd = mix({}, {
        name,
        shortcutCodes: [],
        queue: true,
        executeTimes: 1,
        init() {},
        enable() { return true; },
        execute(graph) {
          this.snapShot = graph.save();
          this.selectedItems = graph.get('selectedItems');
          this.method && (isString(this.method) ? graph[this.method]() : this.method(graph));
        },
        back(graph) {
          graph.read(this.snapShot);
          graph.set('selectedItems', this.selectedItems);
        },
      }, cfg);
      this[name] = cmd;
      this.list.push(cmd);
    }
  }

  execute(name, graph, cfg) {
    const cmd = mix({}, this[name], cfg);
    const manager = this.get('_command');
    if (cmd.enable(graph)) {
      cmd.init();
      if (cmd.queue) {
        manager.queue.splice(manager.current, manager.queue.length - manager.current, cmd);
        manager.current++;
      }
    }
    graph.emit('beforecommandexecute', { command: cmd });
    cmd.execute(graph);
    graph.emit('aftercommandexecute', { command: cmd });
    return cmd;
  }

  enable(name, graph) {
    return this[name].enable(graph);
  }

  destroyPlugin() {
    this._events = null;
    this._cfgs = null;
    this.list = [];
    this.queue = [];
    this.destroyed = true;
  }

  _deleteSubProcessNode(graph, itemId) {
    const subProcess = graph.find('node', (node) => {
      if (node.get('model')) {
        const { clazz } = node.get('model');
        if (clazz === 'subProcess') {
          const containerGroup = node.getContainer();
          const { subGroup } = containerGroup;
          const item = subGroup.findById(itemId);
          return subGroup.contain(item);
        }
        return false;
      }
      return false;
    });
    const group = subProcess.getContainer();
    const resultModel = group.removeItem(subProcess, itemId);
    graph.updateItem(subProcess, resultModel);
  }

  // 工具栏方法
  initCommands() {
    const cmdPlugin = this;
    cmdPlugin.registerCommand('add', {
      enable() {
        return this.type && this.addModel;
      },
      execute(graph) {
        const item = graph.add(this.type, this.addModel);
        if (this.executeTimes === 1) this.addId = item.get('id');
      },
      back(graph) {
        graph.remove(this.addId);
      },
    });
    cmdPlugin.registerCommand('update', {
      enable() {
        return this.itemId && this.updateModel;
      },
      execute(graph) {
        const item = graph.findById(this.itemId);
        if (item) {
          if (this.executeTimes === 1) this.originModel = mix({}, item.getModel());
          graph.update(item, this.updateModel);
        }
      },
      back(graph) {
        const item = graph.findById(this.itemId);
        graph.update(item, this.originModel);
      },
    });
    cmdPlugin.registerCommand('delete', {
      enable(graph) {
        const mode = graph.getCurrentMode();
        const selectedItems = graph.get('selectedItems');
        return mode === 'edit' && selectedItems && selectedItems.length > 0;
      },
      method(graph) {
        const selectedItems = graph.get('selectedItems');
        graph.emit('beforedelete', { items: selectedItems });
        if (selectedItems && selectedItems.length > 0) {
          selectedItems.forEach((i) => {
            const node = graph.findById(i);
            if (node) {
              graph.remove(i);
            } else {
              cmdPlugin._deleteSubProcessNode(graph, i);
            }
          });
        }
        graph.emit('afterdelete', { items: selectedItems });
      },
      shortcutCodes: ['Delete', 'Backspace'],
    });
    cmdPlugin.registerCommand('redo', {
      queue: false,
      enable(graph) {
        const mode = graph.getCurrentMode();
        const manager = cmdPlugin.get('_command');
        return mode === 'edit' && manager.current < manager.queue.length;
      },
      execute(graph) {
        const manager = cmdPlugin.get('_command');
        const cmd = manager.queue[manager.current];
        cmd && cmd.execute(graph);
        manager.current++;
      },
      shortcutCodes: [['metaKey', 'shiftKey', 'z'], ['ctrlKey', 'shiftKey', 'z']],
    });
    cmdPlugin.registerCommand('undo', {
      queue: false,
      enable(graph) {
        const mode = graph.getCurrentMode();
        return mode === 'edit' && cmdPlugin.get('_command').current > 0;
      },
      execute(graph) {
        const manager = cmdPlugin.get('_command');
        const cmd = manager.queue[manager.current - 1];
        if (cmd) {
          cmd.executeTimes++;
          cmd.back(graph);
        }
        manager.current--;
      },
      shortcutCodes: [['metaKey', 'z'], ['ctrlKey', 'z']],
    });
    cmdPlugin.registerCommand('copy', {
      queue: false,
      enable(graph) {
        const mode = graph.getCurrentMode();
        const items = graph.get('selectedItems');
        return mode === 'edit' && items && items.length > 0;
      },
      method(graph) {
        const manager = cmdPlugin.get('_command');
        manager.clipboard = [];
        const items = graph.get('selectedItems');
        if (items && items.length > 0) {
          const item = graph.findById(items[0]);
          if (item) {
            manager.clipboard.push({ type: item.get('type'), model: item.getModel() });
          }
        }
      },
    });
    cmdPlugin.registerCommand('paste', {
      enable(graph) {
        const mode = graph.getCurrentMode();
        return mode === 'edit' && cmdPlugin.get('_command').clipboard.length > 0;
      },
      method(graph) {
        const manager = cmdPlugin.get('_command');
        this.pasteData = clone(manager.clipboard[0]);
        const addModel = this.pasteData.model;
        addModel.x && (addModel.x += 10);
        addModel.y && (addModel.y += 10);
        delete addModel.id;
        const item = graph.add(this.pasteData.type, addModel);
        item.toFront();
      },
    });
    cmdPlugin.registerCommand('zoomIn', {
      queue: false,
      enable(graph) {
        const zoom = graph.getZoom();
        const maxZoom = graph.get('maxZoom');
        const minZoom = graph.get('minZoom');
        return zoom <= maxZoom && zoom >= minZoom;
      },
      execute(graph) {
        const manager = cmdPlugin.get('_command');
        const maxZoom = graph.get('maxZoom');
        const zoom = graph.getZoom();
        this.originZoom = zoom;
        let currentZoom = zoom + manager.zoomDelta;
        if (currentZoom > maxZoom) currentZoom = maxZoom;
        graph.zoomTo(currentZoom);
      },
      back(graph) {
        graph.zoomTo(this.originZoom);
      },
      shortcutCodes: [['metaKey', '='], ['ctrlKey', '=']],
    });
    cmdPlugin.registerCommand('zoomOut', {
      queue: false,
      enable(graph) {
        const zoom = graph.getZoom();
        const maxZoom = graph.get('maxZoom');
        const minZoom = graph.get('minZoom');
        return zoom <= maxZoom && zoom >= minZoom;
      },
      execute(graph) {
        const manager = cmdPlugin.get('_command');
        const minZoom = graph.get('minZoom');
        const zoom = graph.getZoom();
        this.originZoom = zoom;
        let currentZoom = zoom - manager.zoomDelta;
        if (currentZoom < minZoom) currentZoom = minZoom;
        graph.zoomTo(currentZoom);
      },
      back(graph) {
        graph.zoomTo(this.originZoom);
      },
      shortcutCodes: [['metaKey', '-'], ['ctrlKey', '-']],
    });
    cmdPlugin.registerCommand('resetZoom', {
      queue: false,
      execute(graph) {
        const zoom = graph.getZoom();
        this.originZoom = zoom;
        graph.zoomTo(1);
      },
      back(graph) {
        graph.zoomTo(this.originZoom);
      },
    });
    cmdPlugin.registerCommand('autoFit', {
      queue: false,
      execute(graph) {
        const zoom = graph.getZoom();
        this.originZoom = zoom;
        graph.fitView(5);
      },
      back(graph) {
        graph.zoomTo(this.originZoom);
      },
    });
    cmdPlugin.registerCommand('toFront', {
      queue: false,
      enable(graph) {
        const items = graph.get('selectedItems');
        return items && items.length > 0;
      },
      execute(graph) {
        const items = graph.get('selectedItems');
        if (items && items.length > 0) {
          const item = graph.findById(items[0]);
          item.toFront();
          graph.paint();
        }
      },
      back(graph) {

      },
    });
    cmdPlugin.registerCommand('toBack', {
      queue: false,
      enable(graph) {
        const items = graph.get('selectedItems');
        return items && items.length > 0;
      },
      execute(graph) {
        const items = graph.get('selectedItems');
        if (items && items.length > 0) {
          const item = graph.findById(items[0]);
          item.toBack();
          graph.paint();
        }
      },
      back(graph) {

      },
    });
    cmdPlugin.registerCommand('back', {
      queue: false,
      enable(graph) {

      },
      execute(graph) {

      },
      back(graph) {},
    });
  }
}
export default Command;
