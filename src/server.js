const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const app = express();
const methodOverride = require("method-override");
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// mongoose and model config
mongoose.connect('mongodb://localhost:27017/coronaCRM', { useNewUrlParser: true, useUnifiedTopology: true });
const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    bdate: Date,
    notes: String,
    created: { type: Date, default: Date.now }
});

const Customer = mongoose.model("customer", customerSchema);

//REST

//GET all customers
app.get('/', (req, res) => {
    res.redirect("/customers");
});

//GET all customers
app.get('/customers', (req, res) => {
    Customer.find({}, (err, customers) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { customers: customers });
        }
    });

});

//CRATE new customer
app.post("/customers", (req, res) => {
    Customer.create(req.body.customer, (err, newCustomer) => {
        if (err) {
            console.log(err);
        } else {
            console.log()
            res.redirect("/customers");
        }
    });
});

app.get("/customers/:id", (req, res) => {
    Customer.findById(req.params.id, (err, foundCustomer) => {
        if (err) {
            res.redirect("/customers");
        } else {
            res.render("show", { customer: foundCustomer });
        }
    });
});

app.get("/customers/:id/edit", (req, res) => {
    Customer.findById(req.params.id, (err, foundCustomer) => {
        if (err) {
            res.redirect("/customers");
        } else {
            res.render("edit", { customer: foundCustomer });
        }
    });
});

app.put("/customers/:id", (req, res) => {
    Customer.findByIdAndUpdate(req.params.id, req.body.customer, (err, updetedCustomer) => {
        if (err) {
            res.redirect("/customers");
        } else {
            res.redirect("/customers/" + req.params.id)
        }
    });
});

app.delete("/customers/:id", (req, res) => {
    Customer.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/customers");
        } else {
            res.redirect("/customers");
        }
    });
});

app.listen(port, (req, res) => {
    console.log('App is listening on port ' + port);
});