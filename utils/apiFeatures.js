class ApiFeatures {
    constructor(queryObject, reqString, localString) {
        this.queryObject = queryObject
        this.reqString = reqString
        this.localString = localString
        console.log(this.reqString)
        console.log(this.localString)
    }

    filter() {

        const query = { ...this.reqString }
        const excludeField = ["sort", "page", "limit", "fields"]

        excludeField.forEach((ele) => {
            delete query[ele]
        })

        let queryStr = JSON.stringify(query)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|eq)\b/g, (match) => `$${match}`)
        const filter = JSON.parse(queryStr)
        this.queryObject = this.queryObject.find(filter)
        return this;
    }


    sort() {
        if (this.reqString.sort || this.localString.sort) {
            const sortBy = (this.reqString.sort || this.localString.sort).split(",").join(" ");
            this.queryObject = this.queryObject.sort(sortBy)

        } else {
            this.queryObject = this.queryObject.sort("-createdAt")
        }

        return this;
    }


    limitFields() {
        if (this.reqString.fields) {
            const fields = this.reqString.fields.split(",").join(" ")
            this.queryObject.select(fields)
        } else {
            this.queryObject.select("-__v -updatedAt")
        }
        return this;
    }

    paginate() {

        const page = this.reqString.page * 1 || 1
        const limit = this.reqString.limit * 1 || this.localString.limit || 5;
        const skip = (page - 1) * limit
        this.queryObject.skip(skip).limit(limit)


        // if (this.reqString.page) {
        //     const productCount = await this.queryObject.countDocuments();
        //     if (skip >= productCount) {
        //         throw Error("Page is not available")
        //     }
        // }

        return this;
    }
}


export default ApiFeatures