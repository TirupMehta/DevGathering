import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { count, error } = await supabase
            .from("notify_subscribers")
            .select("*", { count: "exact", head: true });

        if (error) {
            console.error("Error fetching waitlist count:", error);
            return NextResponse.json({ count: 0 });
        }

        return NextResponse.json({ count: count || 0 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ count: 0 });
    }
}
