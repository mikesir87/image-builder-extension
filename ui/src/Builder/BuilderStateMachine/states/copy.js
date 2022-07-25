export function CopyState() {

  this.flush = () => {};

  this.onCopyFile = (engine, files) => {
    engine.addCommand(`COPY ${files} .`);
  };

  this.onRunCommand = (engine, command) => {
    engine.transitionTo("RUN").onRunCommand(engine, command);
  };

  this.onSetWorkDir = (engine, newWorkDirToUse) => {
    engine.transitionTo("INIT").onSetWorkDir(engine, newWorkDirToUse);
  };

};