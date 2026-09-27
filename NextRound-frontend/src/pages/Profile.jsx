import { Link } from 'react-router-dom';

function Profile() {
    return (
        <div className="min-h-screen bg-[#0B0F19] px-6 py-12 text-white">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-3xl font-black">
                    Profile
                </h1>

                <p className="mt-2 text-gray-400">
                    Working on this page ....
                </p>
            </div>
            <Link to={"/"}> Go back home </Link>
        </div>
    );
}

export default Profile;