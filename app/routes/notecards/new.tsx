import * as React from "react";
import { Form, json, redirect, useActionData } from "remix";
import type { ActionFunction } from "remix";
import Alert from "@reach/alert";

import { createNotecard } from "~/models/notecard.server";
import { requireUserId } from "~/session.server";

type ActionData = {
    errors?: {
        sideOne?: string;
        sideTwo?: string;
    };
};

export const action: ActionFunction = async ({ request }) => {
    const userId = await requireUserId(request);

    const formData = await request.formData();
    const sideOne = formData.get("sideOne");
    const sideTwo = formData.get("sideTwo");

    if (typeof sideOne !== "string" || sideOne.length === 0) {
        return json<ActionData>(
            { errors: { sideOne: "Side one is required" } },
            { status: 400 }
        );
    }

    if (typeof sideTwo !== "string" || sideTwo.length === 0) {
        return json<ActionData>(
            { errors: { sideTwo: "Side two is required" } },
            { status: 400 }
        );
    }

    const note = await createNotecard({ sideOne, sideTwo, userId });

    return redirect(`/notes/${note.id}`);
};

export default function NewNotecardPage() {
    const actionData = useActionData() as ActionData;
    const sideOneRef = React.useRef<HTMLInputElement>(null);
    const sideTwoRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (actionData?.errors?.sideOne) {
            sideOneRef.current?.focus();
        } else if (actionData?.errors?.sideTwo) {
            sideTwoRef.current?.focus();
        }
    }, [actionData]);

    return (
        <Form
            method="post"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
            }}
        >
            <div>
                <label className="flex w-full flex-col gap-1">
                    <span>Side One: </span>
                    <input
                        ref={sideOneRef}
                        name="sideOne"
                        className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                        aria-invalid={
                            actionData?.errors?.sideOne ? true : undefined
                        }
                        aria-errormessage={
                            actionData?.errors?.sideOne
                                ? "side-one-error"
                                : undefined
                        }
                    />
                </label>
                {actionData?.errors?.sideOne && (
                    <Alert className="pt-1 text-red-700" id="side-one=error">
                        {actionData.errors.sideOne}
                    </Alert>
                )}
            </div>

            <div>
                <label className="flex w-full flex-col gap-1">
                    <span>Side Two: </span>
                    <textarea
                        ref={sideTwoRef}
                        name="sideTwo"
                        rows={8}
                        className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
                        aria-invalid={
                            actionData?.errors?.sideTwo ? true : undefined
                        }
                        aria-errormessage={
                            actionData?.errors?.sideTwo
                                ? "side-two-error"
                                : undefined
                        }
                    />
                </label>
                {actionData?.errors?.sideTwo && (
                    <Alert className="pt-1 text-red-700" id="side-two=error">
                        {actionData.errors.sideTwo}
                    </Alert>
                )}
            </div>

            <div className="text-right">
                <button
                    type="submit"
                    className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
                >
                    Save
                </button>
            </div>
        </Form>
    );
}
