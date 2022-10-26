import { storage, shell, host } from 'uxp';
import { core } from 'photoshop';
import {ExportPanelProps} from "../Panels/ExportPanel";

const LogFileName = 'UIExportLog.log';
let LogFile: storage.File;
let LogFolder: storage.Folder;
let log = '';

export enum LogLevel {
  Info = 'INFO',
  Warning = 'WARNING',
  Error = 'ERROR',
}

export async function Log(Type: LogLevel, Message: string) {
  log += `${Type.toString()} ${Message} \n`;

  // if (LogFile !== undefined) {
  //   const format = `${Type.toString()} ${Message} \n`;
  //   LogFile.write(format, { format: storage.formats.utf8, append: true });
  // }
}

export async function CreateLogFile() {
  LogFolder = await storage.localFileSystem.getFolder();
  LogFile = await LogFolder.createFile(LogFileName, { overwrite: true });

  const hostName = host.name;
  const hostVer = host.version;
  const { apiVersion } = core.apiVersion;
  const { vendor } = core.getCPUInfo();

  await Log(LogLevel.Info, 'Test Log Info');
  await Log(LogLevel.Warning, 'Test Log Warning');
  await Log(LogLevel.Error, 'Test Log Error');

  await Log(LogLevel.Info, `Host: ${hostName}`);
  await Log(LogLevel.Info, `Host Version: ${hostVer}`);
  await Log(LogLevel.Info, `Api Version: ${apiVersion}`);
  await Log(LogLevel.Info, `vendor: ${vendor}`);
}

export async function DeleteLogFile() {
  LogFile.delete();
}

export async function OpenLogFile() {
  shell.openExternal(LogFile.nativePath);
  // await storage.localFileSystem.getFileForOpening();
}

export function getLog(): string {
  return log;
}
