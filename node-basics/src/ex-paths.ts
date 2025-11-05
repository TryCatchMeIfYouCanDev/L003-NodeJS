import path from "node:path";

export default () => {
    const dir: string = "D:\\Test\\test2\\test3\\";
    const now: Date = new Date();
    const year: number = now.getFullYear();
    const fileName: string = "file.md";
    
    const filePath: string = path.join(dir, year.toString(), fileName);
    console.log("Whole path: ", filePath);

    const filePaht2: string = "D:\\Test\\test2\\test3\\tree.jpg";
    console.log("File: ", path.basename(filePaht2));
    console.log("Directory: ", path.basename(dir));
}