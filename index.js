const http = require("http");
const path = require("path");
const fs = require("fs");
const {MongoClient} = require('mongodb');

async function main(){
    const uri ="mongodb+srv://premniranjanv:Prem123@cluster0.hfllcc8.mongodb.net/${Student_Dashboard}?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
 
    try {
        await client.connect();
        return await findStudentsDetails(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'),
            (err, content) => {

                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        );
    } else if (req.url==='/api') {
        let response = await main().catch(console.error);
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(response)
    }
    else{
        res.end("<h1> 404 nothing is here</h1>");
    }
});


async function findStudentsDetails(client ){
    const cursor = client.db("Student_Dashboard").collection("Students").find({});
    const results = await cursor.toArray();
    const js= (JSON.stringify(results[0]));
    return js;
};

const PORT = process.env.PORT || 5555;

server.listen(PORT, () => console.log(`Great our server is running on port ${PORT} `));