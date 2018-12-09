const TestHelper = require('../utils/testhelper')
const mockDB = require('../utils/mockdb')

const emptyList = []
test('Dummy test', () => expect(TestHelper.dummy(emptyList)).toBe(1))

describe('Total likes of blog entries', () => {
    // Total likes
    test('Zero entries', () => expect(TestHelper.totalLikes(emptyList)).toBe(0))
    test('One entry', () => expect(TestHelper.totalLikes(mockDB.singleEntry)).toBe(5))
    test('Multiple entries', () => expect(TestHelper.totalLikes(mockDB.testDatabase)).toBe(36))
})

describe('Top blogs', () => {
    // Top blog
    test('Favorite blog, zero entries', () => expect(TestHelper.favoriteBlog(emptyList)).toBe(undefined))
    test('Favorite blog, one entry', () => expect(TestHelper.favoriteBlog(mockDB.singleEntry)).toBe('Go To Statement Considered Harmful'))
    test('Favorite blog, multiple entries', () => expect(TestHelper.favoriteBlog(mockDB.testDatabase)).toBe("Canonical string reduction"))
})

describe('Top authors', () => {
    // Most blogs
    test('Top author, most blogs, zero entries', () => expect(TestHelper.mostBlogs(emptyList).name).toBe(undefined))
    test('Top author, most blogs, one entry', () => expect(TestHelper.mostBlogs(mockDB.singleEntry).name).toBe('Edsger W. Dijkstra'))
    test('Top author, most blogs', () => expect(TestHelper.mostBlogs(mockDB.testDatabase).name).toBe("Robert C. Martin"))
    // Most likes
    test('Top author, most likes, zero entries', () => expect(TestHelper.mostLikes(emptyList).name).toBe(undefined))
    test('Top author, most likes, one entry', () => expect(TestHelper.mostLikes(mockDB.singleEntry).name).toBe('Edsger W. Dijkstra'))
    test('Top author, most likes', () => expect(TestHelper.mostLikes(mockDB.testDatabase).name).toBe('Edsger W. Dijkstra'))
})
