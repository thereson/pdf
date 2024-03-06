const pt = require("puppeteer");
let fs = require("fs");
let path = require("path")
const hbs = require("handlebars")
let data = require("./data.json")
const express = require("express")
let app = express()



let toPdf = async()=>{

    let browser = await pt.launch({headless:true});
    let page = await browser.newPage();
    const filePath = path.join(process.cwd(),"index.hbs")
    let file = fs.readFileSync(filePath,"utf8");
    let content =  hbs.compile(file)(data)

    await page.setContent(content);
    await page.emulateMediaType("print")
    

   let bill = await page.pdf({
        format: "A4",
        printBackground: true
    });

    await console.log("PDF generated successfully");
    await browser.close();
    return bill
}

let toPng = async()=>{
    let browser = await pt.launch({headless:true});
    let page = await browser.newPage();
    const filePath = path.join(process.cwd(),"index.hbs")
    let file = fs.readFileSync(filePath,"utf8");
    let content =  hbs.compile(file)(data)

    await page.setViewport({
        width:1024,
        height:1024,
        deviceScaleFactor:1
    })

    await page.setContent(content);
    const image = await page.screenshot()
    await console.log(" Image generated successfully");
    await browser.close();
    return image
}

app.get("/invoice",async(req,res)=>{

    try{
        res.writeHead(200,{
            "Content-Type": "application/pdf",
            "content-disposition": "attachment;filename=invoice.pdf"
        })
        const receipt = await toPdf()
        res.end(receipt)

    }catch(err){
        res.send(err.message)
    }
    
})
app.get("/image",async(req,res)=>{
    try{
    const receipt = await toPng()
    res.contentType("application/png")
    res.end(receipt)
    }catch(err){
        res.send(err.message)
    }
    
})

app.listen(8080,()=>{
    console.log("app running ")
})