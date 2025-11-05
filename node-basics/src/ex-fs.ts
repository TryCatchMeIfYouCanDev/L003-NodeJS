import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import chalk from "chalk";
import {DateTime} from "luxon";

export default () => {
    const workDir: string = process.cwd(); // Current Working Directory
    console.log(workDir);

    const dataFullDir: string = path.join(workDir, "data"); // Join the full path to data Folder
    console.log(dataFullDir);
    
    const filesPath: string = path.join(dataFullDir, "file.txt");
    console.log(filesPath);

    /* Reading Files */
    try {
        const text: string = fs.readFileSync(filesPath, "utf-8");
        console.log(text);
    } catch(error){
        console.log(chalk.red("An error has occurred!"));
    } finally {
        console.log("Operation Completed!")
    }
    
    /* Writing Files */
    try {
        let content: string = `It's **${new Date().toLocaleTimeString()}**`;
        fs.writeFileSync(path.join(dataFullDir, "timetable.md"),content,"utf-8");
        console.log("Writing process executed.");
    } catch(error){
        console.log(chalk.red("An error has occurred!"));
    } finally {
        console.log("Operation Completed!")
    }

    /* Reading Directories */
    try{
        // First method - Directory Entities
        const entities: fs.Dirent<string>[] = fs.readdirSync(workDir, {withFileTypes:true});
        console.log(`The content of the Directory is: ${chalk.green(workDir)}`);
        for(const entity of entities){
            console.log(entity.isDirectory() ? "[Directory]":"[File]", chalk.yellow(entity.name));
        }
        // Second method - Strings        
        console.log(`The content of the Directory is: ${chalk.green(workDir)}`);
        const names: string[] = fs.readdirSync(workDir);
        for(const name of names){
            const stat: fs.Stats = fs.statSync(path.join(workDir, name));
            let creationDate: DateTime = DateTime.fromMillis(stat.ctimeMs);
            // let dateString: string = creationDate.setLocale("de").toFormat("DDDD dd MMMM yyyy HH:mm");
            let dateStringRelative: string|null = creationDate.setLocale("de").toRelative();
            console.log(stat.isDirectory() ? "[Directory]" : "[File]", chalk.green(name), stat.size, chalk.blue(dateStringRelative));
        }
    } catch(error){
        console.log(chalk.red("An error has occurred!"));
    } finally {
        console.log("Operation Completed!")
    }

    /* Create Directory */
    
    let octoberPath: string = path.join(dataFullDir, "spreadsheets-october");
    let novemberPath: string = path.join(dataFullDir, "spreadsheets-november");
    try {
        let content: string = `It's **${new Date().toLocaleTimeString()}**. Just because the forlder wont be empty.`;
        fs.mkdirSync(path.join(dataFullDir, "spreadsheets-october"));
        fs.mkdirSync(novemberPath);
        fs.writeFileSync(path.join(novemberPath, "testFile.md"), content, "utf-8");
        console.log("Writing process executed.");
    } catch(error: any){
        console.log(chalk.red("An error has occurred!"));
        console.log(error.message);
    } finally {
        console.log("Operation Completed!")
    }

    /* Remove a Directory */
    try {
        fs.rmSync(octoberPath, {recursive:true, force:true});
        console.log(`Deleting process executed. Folder: ${chalk.green(path.basename(octoberPath))} deleted.`);
        fs.rmSync(novemberPath, { recursive: true, force: true });
        console.log(`Deleting process executed. Folder: ${chalk.blue(path.basename(novemberPath))} deleted.`);
    } catch(error: any){
        console.log(chalk.red("An error has occurred!"));
        console.log(error.message);
    } finally {
        console.log("Operation Completed!")
    }

    /* Rename & Move Directories */
    try {        
        let year25Path: string = path.join(dataFullDir, "spreadsheets-2025");        
        let year26Path: string = path.join(dataFullDir, "spreadsheets-2026");
        let dec25: string = path.join(year25Path, "december-2025");
        let dec24: string = path.join(year25Path, "december-2024");
        let dec26Wrong: string = path.join(year25Path, "december-2026");
        let dec26Right: string = path.join(year26Path, "december-2026");
        
        
        if(!fs.existsSync(year25Path)){
            fs.mkdirSync(year25Path);
            console.log(`Creating process executed. Folders ${chalk.blue(path.basename(year25Path))} was created.`);        
        } else {console.log(chalk.yellow(`Folder ${path.basename(year25Path)} already exists.`)); }
        if(!fs.existsSync(year26Path)){
            fs.mkdirSync(year26Path); 
            console.log(`Creating process executed. Folders ${chalk.blue(path.basename(year26Path))} was created.`);            
        } else {console.log(chalk.yellow(`Folder ${path.basename(year26Path)} already exists.`)); }
        if(!fs.existsSync(dec25)){
            fs.mkdirSync(dec25);
            console.log(`Creating process executed. Folders ${chalk.blue(path.basename(dec25))} was created.`);         
        } else {console.log(chalk.yellow(`Folder ${path.basename(dec25)} already exists.`));}
        if(!fs.existsSync(dec24)){
            fs.mkdirSync(dec24);            
            console.log(`Creating process executed. Folders ${chalk.blue(path.basename(dec24))} was created.`);         
        } else {console.log(chalk.yellow(`Folder ${path.basename(dec24)} already exists.`));}   
        
        /* Rename Process */ 
        if(fs.existsSync(dec24)){
            if(!fs.existsSync(dec26Wrong)){
                fs.renameSync(dec24, dec26Wrong);
                console.log(`Folder ${chalk.blue(path.basename(dec24))} was renamed in ${chalk.green(path.basename(dec26Wrong))}.`)
            } else {
                console.log(chalk.yellow(`Folder ${path.basename(dec26Wrong)} already exists. Rename process failed.`));
            }
        } else { console.log(`Folder ${chalk.red(path.basename(dec24))} was not found.`)}

        /* Move Process*/
        if(fs.existsSync(dec26Wrong)){
            if(fs.existsSync(year26Path)){
                if(!fs.existsSync(dec26Right)){
                    fs.renameSync(dec26Wrong, dec26Right);
                    console.log(`Folder ${chalk.green(path.basename(dec26Right))} was moved from folder ${chalk.blue(path.basename(year25Path))} in folder ${chalk.green(path.basename(year26Path))}.`);
                }  else {
                        console.log(chalk.red(`A folder ${path.basename(dec26Right)} already exists in destination folder. Move process failed.`));
                }
            } else {
                console.log(chalk.red(`Destination folder ${path.basename(year26Path)} doesn't exist. Move process failed.`));
            }
        } else {
            console.log(chalk.red(`Folder ${path.basename(dec26Wrong)} doesn't exist. Move process failed.`));
        }

    } catch(error: any){
        console.log(chalk.red("An error has occurred!"));
        console.log(error.message);
    } finally {
        console.log("Operation Completed!")
        console.log("\n", "=".repeat(30), "\n");

        const entities: fs.Dirent<string>[] = fs.readdirSync(dataFullDir, {withFileTypes:true});
        console.log(`The content of the Directory is: ${chalk.green(dataFullDir)}`);
        for(const entity of entities){
            console.log(entity.isDirectory() ? "[Directory]":"[File]", chalk.yellow(entity.name));
        }        
        console.log("\n", "=".repeat(30), "\n");
    }
}