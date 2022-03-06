import { storage, shell, host, os, entrypoints } from 'uxp';
import { core } from 'photoshop'

const LogFileName = 'UIExportLog.log';
let LogFile: storage.File;
let LogFolder: storage.Folder;
let LoggingEnabled;

export enum LogLevel {
  Info = 'INFO',
  Warning = 'WARNING',
  Error = 'ERROR',
}

export function Log(Type: LogLevel, Message: string) {

    const format = `${Type.toString()} ${Message} \n`;
    LogFile.write(format, { format: storage.formats.utf8, append: true });

}

export async function CreateLogFile() {
  try {
    LogFolder = await storage.localFileSystem.getFolder();
    LogFile = await LogFolder.createFile(LogFileName, { overwrite: true });

    const hostName = host.name;
    const hostVer = host.version;
    const { apiVersion } = core.apiVersion;
    const { logicalCores, frequencyMhz, vendor } = core.getCPUInfo();
    const { gpuInfoList, clgpuInfoList } = core.getGPUInfo();


    Log(LogLevel.Info, `Host: ${hostName}`);
    Log(LogLevel.Info, `Host Version: ${hostVer}`);
    Log(LogLevel.Info, `Api Version: ${apiVersion}`);
    Log(LogLevel.Info, `vendor: ${vendor}`);


    // Log(LogLevel.Info, `Host Version: ${}`);
  } catch (e) {
    console.log(e);
  }
}

export async function DeleteLogFile() {
  LogFile.delete();
}

export async function OpenLogFile() {
  shell.openExternal(LogFile.nativePath);
  // await storage.localFileSystem.getFileForOpening();
}
