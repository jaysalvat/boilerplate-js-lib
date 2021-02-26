/* eslint-env mocha */

export default function test(expect, Lib) {

  describe('Some tests', function () {
    describe('Init', function () {
      it('should works', function () {
        expect(new Lib().method()).to.be.equal(true)
      })
    })
  })

}
