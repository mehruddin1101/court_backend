const express =  require('express')

const app =express()

// MARK : - MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended: true}))




// MARK : -  auth ROUTES
app.use("/api/v1/auth", require("./routes/auth.route"))




app.listen(3000, () => { () => console.log('Lustening to portt  200') } )
