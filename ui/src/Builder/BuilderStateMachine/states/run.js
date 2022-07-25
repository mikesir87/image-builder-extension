export function RunState() {
  let commands = [];

  function clearCommands(engine) {
    if (commands.length > 0) {
      engine.addCommand(`RUN ${commands.join(" && \\\n    ")}`)
      commands = [];
    }
  }

  this.flush = (engine) => {
    clearCommands(engine);
  }

  this.onCopyFile = (engine, files) => {
    clearCommands(engine);
    engine.transitionTo("COPY").onCopyFile(engine, files);
  };

  this.onRunCommand = (engine, command) => {
    commands.push(command);
  };

  this.onSetWorkDir = (engine, newWorkDirToUse) => {
    clearCommands(engine);
    engine.transitionTo("INIT").onSetWorkDir(engine, newWorkDirToUse);
  };

};