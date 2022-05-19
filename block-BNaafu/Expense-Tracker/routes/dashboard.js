var express = require('express');
var router = express.Router()

var Income = require('../modals/income');
var Expense = require('../modals/expense');
var User = require('../modals/user')
var auth = require('../middlewares/auth')


router.get('/', auth.isUser, auth.allfilter, (req, res, next) => {

    Income.find({ userID: req.user.id }, (err, income) => {
        var totalincome = gettotal(income)


        Expense.find({ userID: req.user.id }, (err, expense) => {
            var totalexpense = gettotal(expense)

            // var balance = totalincome - totalexpense
            res.render('dashboard', {  income, expense, totalexpense, totalincome });
        })
    })
})




router.post('/income', auth.isUser,auth.allfilter, (req, res, next) => {
    req.body.userID = req.user.id;
    // console.log(req.user);
    Income.create(req.body, (err, income) => {
        console.log(err, income);
        res.redirect('/dashboard')
    })

})



router.post('/expense', (req, res, next) => {
    req.body.userID = req.user.id;
    Expense.create(req.body, (err, expense) => {
        console.log(err, expense);
        res.redirect('/dashboard')
    })
})


router.get('/date', auth.isUser, auth.allfilter, (req, res, next) => {
    let start = req.query.start;
    let end = req.query.end;
    let source = req.query.source
    let category = req.query.category
    //  let year = req.query.month.split('-')[0];
    let month = req.query.month
    //  let date = year + '-' + month + '-' + '01';

    if (start && end) {
        Income.find({ 'date': { $gt: start, $lt: end }, userID: req.user.id }, (err, income) => {
            var totalincome = gettotal(income)


            Expense.find({ 'date': { $gt: start, $lt: end }, userID: req.user.id }, (err, expense) => {
                var totalexpense = gettotal(expense)

                // var balance = totalamount-totalexpense
                res.render('dashboard', {  income, expense, totalexpense, totalincome });
            })
        })
    } else if (source) {

        Income.find({ source, userID: req.user.id }, (err, income) => {
            console.log(income, 'income')
            // Income.find({'date':{$gt:start,$lt:end}}, (err,income)=>{
            var totalincome = gettotal(income)
            res.render('dashboard', {  income: income, expense: [], totalexpense: 0, totalincome });
        })

        // })
    } else if (category) {

        Expense.find({ category, userID: req.user.id }, (err, expense) => {
            console.log(expense, 'expense')
            // Income.find({'date':{$gt:start,$lt:end}}, (err,income)=>{
            var totalexpense = gettotal(expense)
            res.render('dashboard', {  income: [], expense: expense, totalincome: 0, totalexpense });
        })


    } else if (month) {
        let year = req.query.month.split('-')[0];
        let month = req.query.month.split('-')[1];
        let date = year + '-' + month + '-' + '01';
        let firstDay = new Date(
            new Date(date).getFullYear(),
            new Date(date).getMonth(),
            1
        )
        let lastDay = new Date(
            new Date(date).getFullYear(),
            new Date(date).getMonth() + 1
        )

        console.log(month, "date");

        Income.find({ date: { $gt: firstDay, $lt: lastDay }, userID: req.user.id }, (err, income) => {
            console.log(month, 'month')
            // Income.find({'date':{$gt:start,$lt:end}}, (err,income)=>{
            var totalincome = gettotal(income)
            Expense.find({ date: { $gt: firstDay, $lt: lastDay }, userID: req.user.id }, (err, expense) => {
                console.log(month, 'month')
                // Income.find({'date':{$gt:start,$lt:end}}, (err,income)=>{
                var totalexpense = gettotal(expense)

                res.render('dashboard', {  income: income, expense: expense, totalincome, totalexpense });
            })
        })
    }



})


function gettotal(arr) {
    return arr.reduce((acc, cv) => {
        acc = acc + cv.amount
        return acc;

    }, 0)
}

module.exports = router;