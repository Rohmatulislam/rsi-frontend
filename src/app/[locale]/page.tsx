import HomePage from "~/features/home/pages/HomePage";

export default async function Page(props: any) {
    // Standardize access to params for both old and new Next.js
    const params = await props.params;
    console.log('>>> [Page] Rendering HomePage for params:', params);
    return <HomePage />;
}