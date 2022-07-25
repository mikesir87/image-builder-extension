import { CopyState } from "./states/copy";
import { InitState } from "./states/init";
import { RunState } from "./states/run";

const STATES = {
  INIT: new InitState(),
  COPY: new CopyState(),
  RUN:  new RunState(),
}

export function BuilderStateMachine() {
  let dockerfileCommands = [];
  let currentState = STATES.INIT;
  
  const machine = {
    addCommand,
    transitionTo,
  };

  function addCommand(command) {
    dockerfileCommands.push(command);
    console.log(command);
  }

  function transitionTo(newState) {
    currentState = STATES[newState];
    return currentState;
  };

  this.getDockerfile = function () {
    currentState.flush(machine);
    return dockerfileCommands.join("\n");
  };

  this.setWorkDir = function (newWorkDir) {
    currentState.onSetWorkDir(machine, newWorkDir);
  };

  this.copyFile = function (hostPath) {
    currentState.onCopyFile(machine, hostPath);
  };

  this.runCommand = function (command) {
    currentState.onRunCommand(machine, command);
  };

}