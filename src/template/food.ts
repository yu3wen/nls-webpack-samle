
const nls= require('vscode-nls');

const localize = nls.loadMessageBundle();
import * as vscode from 'vscode';

export function foodCommand() {
	const message =localize('hello.food', 'I love shrimp dumpling!!');
	vscode.window.showInformationMessage(message);
}