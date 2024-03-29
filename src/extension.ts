// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below


const nls= require('vscode-nls');
// import * as nls from 'vscode-nls';  //use import need babel
const localize = nls.config({ messageFormat: nls.MessageFormat.both,bundleFormat: nls.BundleFormat.standalone })();
import * as vscode from 'vscode';
import { foodCommand } from './template/food';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	//test
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "nlswebpack" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('nlswebpack.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
    const message=localize('hello.world','Hello World from nlswebpack!');
		vscode.window.showInformationMessage(message);
    // vscode.window.showInformationMessage('11111111111');
	});

  const fcmd=vscode.commands.registerCommand('nlswebpack.helloFood', foodCommand);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
