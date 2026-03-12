import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json(
        {
            error: "AI quiz generation is temporrarly disabled"        },
        {status:503}
    )
}