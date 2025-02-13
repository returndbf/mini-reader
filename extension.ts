// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import path from "node:path";

let txtContent = "";
const txtName = "鼠疫";
export async function activate(context: vscode.ExtensionContext) {
  await getText();

  let statusBarItem: vscode.StatusBarItem;
  const read = vscode.commands.registerCommand("btm.read", () => {
    statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    );
	statusBarItem.text = getCurText(context);
	statusBarItem.show();
    
  });
  const next = vscode.commands.registerCommand("btm.next", () => {
	if (!statusBarItem) {
		return;
	  }
	statusBarItem.text = getCurText(context);
  });
  const stop = vscode.commands.registerCommand("btm.stop", () => {
    if (!statusBarItem) {
      return;
    }
    statusBarItem.hide();
  });

  context.subscriptions.push(read, stop,next);
}

const getText = async () => {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]; // 获取第一个工作区
  const filePath = path.join(workspaceFolder!.uri.fsPath, txtName + ".txt"); // 构建文件路径
  const fileUri = vscode.Uri.file(filePath);
  const data = await vscode.workspace.fs.readFile(fileUri);
  const realData = new TextDecoder().decode(data);
  txtContent = realData;
};


const getCurText = (context: vscode.ExtensionContext) => {
	let result = ''
	let charCount = 0;
    const storagePage = context.globalState.get<number>(txtName)
	
    if( storagePage){
		for (let i = storagePage; i < txtContent.length; i++) {
			const char = txtContent[i];
	
			if (char === '\r' || char === '\n' || char==='\r\n') {
				charCount++;
				break;
			}
	
			result += char;
			charCount++;
	
			if (charCount >= 50) {
			
				break;
			}
		}
        context.globalState.update(txtName, storagePage + charCount);
		return result
        // return txtContent.substring(storagePage, storagePage + charCount);
    }
 
  context.globalState.update(txtName,  10);
  return txtContent.substring(0, 10);
};
// This method is called when your extension is deactivated
export function deactivate() {}