import avatars from "../../../components/tutor_profile/AvatarList";

const CartSummary = ({ cartItems }) => {
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0), 0) / 100;
  };

  return (
    <div className="flex-1 p-5 rounded-tr-2xl bg-[#FCFCFC]">
      <h2 className="text-2xl font-bold text-gray-500 pb-2 pt-8">Your Cart</h2>

      {cartItems.map((item) => {
        const fetchAvatar = avatars.find((ava) => ava.id === item.avatar);
        
        return (
          <div key={item.id} className="flex flex-col bg-white shadow-sm rounded-xl mb-3">
            <div className="flex flex-row">
              <div className="flex-1 pl-5 pt-4 pb-3">
                <img
                  src={fetchAvatar?.src || avatars[0].src}
                  alt="Avatar"
                  className="w-20 object-cover"
                />
              </div>
              <div className="flex-[3] py-4 pl-2">
                <p className="text-gray-700"><strong className="text-gray-600">Tutor: </strong>{item.tutor}</p>
                <p className="text-gray-700"><strong className="text-gray-600">Subject: </strong>{item.subject}</p>
                <p><strong className="text-gray-600">Timeslot: </strong></p>
                <div className="font-semibold text-gray-700 mr-4 text-center rounded-lg bg-orange-100 py-1 my-1">{item.date}</div>
                <div className="font-semibold text-yellow-800 mr-4 text-center rounded-lg bg-yellow-100 py-1">{item.time}</div> 
              </div>
            </div>
            <div className="px-5 flex flex-col gap-1 pb-3">
              <hr />
              <p className="px-2 text-gray-700">
                <strong className="text-gray-600">Price: </strong>
                {item.price ? `$${item.price / 100}` : 'Calculating...'}
              </p>
            </div>
          </div>
        );
      })}

      <div className="flex flex-col px-3 text-gray-500">
        <div className="flex justify-between pb-2">
          <p className="pl-1"><strong>Subtotal</strong></p>
          <p>${calculateSubtotal()}</p>
        </div>
        <hr className="pb-2"/>
        <div className="flex justify-between pb-2 text-gray-600">
          <p className="pl-1 text-2xl"><strong>Total</strong></p>
          <p className="text-2xl"><strong>${calculateSubtotal()}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;