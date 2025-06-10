import React from 'react';
import { Link } from 'react-router-dom';
import avatars from '../../../components/tutor_profile/AvatarList';

const OrderDetails = ({ orders, avatar }) => {
    const fetchAvatar = avatars.find((ava) => ava.id === avatar);

    return (
        <>
            <div className="flex flex-row gap-2 mt-2">
                <button className="flex text-center justify-center font-bold text-yellow-700 py-2 flex-1 rounded-lg bg-orange-200">
                    Order Details
                </button>
            </div> 

            {orders.map((order, index) => (
                <React.Fragment key={index}>
                    <div className="my-2 mx-2 flex flex-row p-2 rounded-md">
                        <div>
                            <img
                                src={fetchAvatar?.src || avatars[0].src}
                                alt="Avatar"
                                className="w-28 object-cover"
                            />
                        </div>
                        <div className="mx-2 w-full">
                            <p className="text-gray-600"><strong className="text-gray-600">Tutor: </strong>{order.tutorName}</p>
                            <p className="text-gray-600"><strong className="text-gray-600">Subject: </strong>{order.subject}</p>
                            <p className="text-gray-600"><strong className="text-gray-600">Timeslot: </strong>{order.timeslot}</p>
                            <p className="text-gray-600"><strong className="text-gray-600">Price: </strong>{order.price ? `$${order.price}` : 'Calculating...'}</p>
                        </div>
                    </div>
                    {index < orders.length - 1 && <hr className="mx-2" />}
                </React.Fragment>
            ))}
            <hr className="mx-2 mb-4" />

            <Link to="/payment" className="text-center w-full py-2 px-8 ml-3 rounded-lg bg-yellow-100 font-bold text-yellow-600 hover:bg-yellow-200 transition-colors">
                Back
            </Link>
        </>
    );
};

export default OrderDetails;