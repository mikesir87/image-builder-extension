export function InitState() {
  let workDir = "/";
  let newWorkDir = "/";

  function checkForWorkDirChange(machine) {
    if (newWorkDir !== workDir) {
      machine.addCommand(`WORKDIR ${newWorkDir}`);
      workDir = newWorkDir;
    }
  }

  this.flush = (engine) => {
    checkForWorkDirChange(engine);
  }

  this.onCopyFile = (machine, files) => {
    checkForWorkDirChange(machine);
    machine.transitionTo("COPY").onCopyFile(machine, files);
  };

  this.onRunCommand = (machine, command) => {
    checkForWorkDirChange(machine);
    machine.transitionTo("RUN").onRunCommand(machine, command);
  };

  this.onSetWorkDir = (machine, newWorkDirToUse) => {
    newWorkDir = newWorkDirToUse;
  };

};