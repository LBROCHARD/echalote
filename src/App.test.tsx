import App from "./App"
import { render } from "@testing-library/react"

describe('First Test', () => {
    it('Should render component', () => {
        render(<App/>)
        expect(true).toBeTruthy()
    })
})