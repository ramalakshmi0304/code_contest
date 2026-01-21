import express from "express"
import fs, { readFileSync } from "fs";

const readData = ()=>{
    const data = readFileSync ("/db.json", "util-8");
    return JSON.parse(data, null,2)
}

const writeData =(data)=>{
    writeFileSync("/db.json", JSON.stringify(data))
}