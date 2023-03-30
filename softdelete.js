const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const app = express();

mongoose.connect("mongodb://0.0.0.0:27017/sample", {useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("Connected with Mongodb")
}).catch((err)=>{
    console.log(err)
});

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())

const productSchema = new mongoose.Schema({
    name: String,
    description:String,
    price: Number,
    isDeleted: Boolean,
},
{ timestamps: true },
)

 

const Product = new mongoose.model("Product", productSchema);

// Create Product
app.post("/api/v1/product/new",async(req, res)=>{
    const product = await Product.create(req.body);

    res.status(200).json({
        success:true,
        product
    })
})

// Read Product
app.get("/api/v1/products",async(req,res)=>{
    try{

        const product = await Product.find();
        if(!product || product.isDeleted === true) {
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }
        res.status(200).json({success:true, product})
    }
    catch(error) {
        res.status(404).json({error: errorHandler(error)});
    }
})

//Update Product
app.put("/api/v1/product/:id", async(req,res)=>{
    let product = await Product.findById(req.params.id)
    
    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,
    useFindAndModify:true,
    runValidators:true
})

res.status(200).json({
    success:true,
    product
})
})


//Delete product
app.delete("/api/v1/product/:id",async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        // await product.deleteOne();
        if(!product || product.isDeleted === true ){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }

        product.isDeleted = true;
       await product.save();
    
        
    
        res.status(200).json({
            success:true,
            message:"Product is deleted successfully"
        })
    }
    catch (error) {
        res.status(400).json({
            error: errorHandler(error)
        })
    }
})


app.listen(4500, ()=>{
    console.log("Server is working http://localhost:4500")
})



// run();
