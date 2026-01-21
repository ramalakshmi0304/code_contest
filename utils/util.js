import { readFileSync, writeFileSync } from "fs";


const readData = () => {
    const data = readFileSync("db.json", "utf-8");
    return JSON.parse(data);
};

const writeData = (data) => {
    writeFileSync("db.json", JSON.stringify(data, null, 2));
};

export { readData, writeData };
