const Joi = require('joi');
const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const { tryCatch } = require('./utils/tryCatch');
const app = express();

app.use(express.json());


const cars = [];
const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`Listening to port ${port}`));


app.post('/api/posts/cars', (req,res)=>{
    const {error} = validateCar(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    const car = {
        id: cars.length +1,
        name: req.body.name
    };
    cars.push(car);
    res.send(car);
});


app.get('/api/cars',tryCatch(async (req,res)=>{
    if(cars.length===0) throw new Error('No cars found');
    res.send(cars);
}));


app.get('/api/cars/:id', tryCatch(async (req,res)=>{
    const car = cars.find(c=>c.id === parseInt(req.params.id));
    if(!car) throw new Error('Car not found');
    res.send(car);
}));

app.put('/api/cars/:id',tryCatch(async (req,res)=>{
    const car = cars.find(c=>c.id === parseInt(req.params.id));
    if(!car) throw new Error('Car not found');
    const {error} = validateCar(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    car.name = req.body.name;
    res.send(car);
}));

app.delete('/api/cars/:id', tryCatch(async (req,res)=>{
const car = cars.find(c=>c.id === parseInt(req.params.id));
if(!car) throw new Error('Car not found');
const index = cars.indexOf(car);
cars.splice(index,1);
res.send(car);
}));


function validateCar(car){
    const schema = Joi.object({name: Joi.string().min(3).required()});
    return schema.validate(car);
}


app.use(errorHandler);