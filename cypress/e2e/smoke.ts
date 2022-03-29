import faker from "@faker-js/faker";

describe("smoke tests", () => {
    afterEach(() => {
        cy.cleanupUser();
    });

    it("should allow you to register and login", () => {
        const loginForm = {
            email: `${faker.internet.userName()}@example.com`,
            password: faker.internet.password(),
        };
        cy.then(() => ({ email: loginForm.email })).as("user");

        cy.visit("/");
        cy.findByRole("link", { name: /sign up/i }).click();

        cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
        cy.findByLabelText(/password/i).type(loginForm.password);
        cy.findByRole("button", { name: /create account/i }).click();

        cy.findByRole("link", { name: /notecards/i }).click();
        cy.findByRole("button", { name: /logout/i }).click();
        cy.findByRole("link", { name: /log in/i });
    });

    it("should allow you to make a new notecard", () => {
        const testNote = {
            sideOne: faker.lorem.words(1),
            sideTwo: faker.lorem.sentences(1),
        };
        cy.login();
        cy.visit("/");

        cy.findByRole("link", { name: /notecards/i }).click();
        cy.findByText("No notecards yet");

        cy.findByRole("link", { name: /\+ new notecard/i }).click();

        cy.findByRole("textbox", { name: /sideOne/i }).type(testNote.sideOne);
        cy.findByRole("textbox", { name: /sideTwo/i }).type(testNote.sideTwo);
        cy.findByRole("button", { name: /save/i }).click();

        cy.findByRole("button", { name: /delete/i }).click();

        cy.findByText("No notecards yet");
    });
});
