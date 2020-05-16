import editorStyle from "../util/defaultStyle";

const deepMix = require("@antv/util/lib/deep-mix");

const dbDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 18,
    height: 18,
    left: 6,
    top: 6
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: "#FEF7E8",
    stroke: "#5A6CE6",
    cursor: "default"
  },
  stateStyles: {
    selected: {
      fill: "#EBEEFF"
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode
    }
  }
};
const httpDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 18,
    height: 18,
    left: 6,
    top: 6
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: "#FEF7E8",
    stroke: "#7DADFF",
    cursor: "default"
  },
  stateStyles: {
    selected: {
      fill: "#E2EDFF"
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode
    }
  }
};
const ruleDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 18,
    height: 18,
    left: 6,
    top: 6
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: "#FEF7E8",
    stroke: "#F5A725",
    cursor: "default"
  },
  stateStyles: {
    selected: {
      fill: "#FFEAC8"
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode
    }
  }
};
const bpmfaultOptions = {
  icon: null,
  iconStyle: {
    width: 18,
    height: 18,
    left: 6,
    top: 6
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: "#FEF7E8",
    stroke: "#48BADE",
    cursor: "default"
  },
  stateStyles: {
    selected: {
      fill: "#DBF6FF"
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode
    }
  }
};
export default function(G6) {
  G6.registerNode(
    "db-insert-node",
    {
      options: deepMix({}, dbDefaultOptions, {
        icon: require("../assets/flow/db_insert.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "db-update-node",
    {
      options: deepMix({}, dbDefaultOptions, {
        icon: require("../assets/flow/db_update.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "db-delete-node",
    {
      options: deepMix({}, dbDefaultOptions, {
        icon: require("../assets/flow/db_delete.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "db-findById-node",
    {
      options: deepMix({}, dbDefaultOptions, {
        icon: require("../assets/flow/db_findById.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "db-findByPage-node",
    {
      options: deepMix({}, dbDefaultOptions, {
        icon: require("../assets/flow/db_findByPage.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "db-findByWhere-node",
    {
      options: deepMix({}, dbDefaultOptions, {
        icon: require("../assets/flow/db_findByWhere.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "db-findBySQLPage-node",
    {
      options: deepMix({}, dbDefaultOptions, {
        icon: require("../assets/flow/db_findBySQLPage.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "db-findBySQLWhere-node",
    {
      options: deepMix({}, dbDefaultOptions, {
        icon: require("../assets/flow/db_findBySQLWhere.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "restful-get-node",
    {
      options: deepMix({}, httpDefaultOptions, {
        icon: require("../assets/flow/restful_get.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "restful-post-node",
    {
      options: deepMix({}, httpDefaultOptions, {
        icon: require("../assets/flow/restful_post.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "rule-java-node",
    {
      options: deepMix({}, ruleDefaultOptions, {
        icon: require("../assets/flow/rule_java.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "rule-moudule-node",
    {
      options: deepMix({}, ruleDefaultOptions, {
        icon: require("../assets/flow/rule_moudule.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "bpm-start-node",
    {
      options: deepMix({}, bpmfaultOptions, {
        icon: require("../assets/flow/bpm_start.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "bpm-pause-node",
    {
      options: deepMix({}, bpmfaultOptions, {
        icon: require("../assets/flow/bpm_pause.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "bpm-active-node",
    {
      options: deepMix({}, bpmfaultOptions, {
        icon: require("../assets/flow/bpm_active.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "bpm-destroy-node",
    {
      options: deepMix({}, bpmfaultOptions, {
        icon: require("../assets/flow/bpm_destroy.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "bpm-approve-node",
    {
      options: deepMix({}, bpmfaultOptions, {
        icon: require("../assets/flow/bpm_approve.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "bpm-addUser-node",
    {
      options: deepMix({}, bpmfaultOptions, {
        icon: require("../assets/flow/bpm_addUser.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "bpm-commissionTask-node",
    {
      options: deepMix({}, bpmfaultOptions, {
        icon: require("../assets/flow/bpm_commissionTask.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "bpm-perform-node",
    {
      options: deepMix({}, bpmfaultOptions, {
        icon: require("../assets/flow/bpm_perform.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "bpm-workflowInstDetail-node",
    {
      options: deepMix({}, bpmfaultOptions, {
        icon: require("../assets/flow/bpm_workflowInstDetail.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
  G6.registerNode(
    "bpm-taskAppoint-node",
    {
      options: deepMix({}, bpmfaultOptions, {
        icon: require("../assets/flow/bpm_taskAppoint.svg")
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      }
    },
    "work-rect-node"
  );
}
