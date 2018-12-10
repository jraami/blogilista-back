const dummy = (blogs) => {
    return (1)
}

const totalLikes = (blogs) => {
    const reducer = (accumulator, current) => {
        return accumulator + current.likes
    }
    const likeSum = blogs.reduce(reducer, 0)
    return (likeSum)
}

const favoriteBlog = (blogs) => {
    const reducer = (favorite, current) => {
        if (current.likes > favorite.likes) {
            favorite = current
        }
        return (favorite)
    }
    const favBlog = blogs.reduce(reducer, blogs[0])
    if (favBlog === undefined) return (undefined)
    else {
        return (favBlog.title)
    }
}

const blogAuthors = (blogs) => {
    authors = []
    // find all blog authors and map them to a new array, authors. Set numBlogs as 1 and likes as 0 to start. If the author exists in authors, add one to numBlogs and sum of likes.
    blogs.forEach((entry) => {
        if (authors.find((authors) => authors.name === entry.author) === undefined) {
            authors = authors.concat({
                name: entry.author,
                numBlogs: 1,
                likes: entry.likes
            })
        }
        else {
            currentAuthor = authors.find((author) => author.name === entry.author)
            currentAuthor.numBlogs++
            currentAuthor.likes += entry.likes
        }
    })
    return (authors)
}

const mostBlogs = (blogs) => {
    const reducer = (most, current) => {
        if (current.numBlogs > most.numBlogs) {
            most = current
        }
        return (most)
    }

    authorList = blogAuthors(blogs)
    const topAuthor = authorList.reduce(reducer, authorList[0])
    if (topAuthor === undefined) return ({
        name: undefined, numBlogs: undefined
    })
    else {
        return (topAuthor)
    }
}

const mostLikes = (blogs) => {
    const reducer = (most, current) => {
        if (current.likes > most.likes) {
            most = current
        }
        return (most)
    }

    authorList = blogAuthors(blogs)
    const topAuthor = authorList.reduce(reducer, authorList[0])
    if (topAuthor === undefined) return ({
        name: undefined, numBlogs: undefined, likes: undefined
    })
    else {
        return (topAuthor)
    }
}

const documentsInDB = (blogs) => {

}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, documentsInDB }