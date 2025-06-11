import { AwardIcon } from '../../../assets/icon';

const Awards = ({ data }) => {
    return (
        <div className='flex flex-col gap-6 py-2'>
            <h1 className='text-2xl text-yellow-800 font-bold'>CERTIFICATION & AWARD</h1>
            <div className='flex flex-col gap-4'>
                {data?.map((award, index) => (
                    <div key={index} className='flex gap-2'>
                        {AwardIcon}
                        <div className='flex flex-col gap-2'>
                            <div className='text-xl font-semibold'>{award.name}</div>
                            <div>{award.year}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Awards;
