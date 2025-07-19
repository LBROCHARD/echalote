import App from "./App"
import { render } from "@testing-library/react"
import AuthProvider from "./providers/AuthContext"

describe('First Test', () => {
    it('Should render component', () => {
        render(
            <AuthProvider>
                <App/>
            </AuthProvider>
        )
        expect(true).toBeTruthy()
    })
})