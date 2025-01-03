import React from 'react';
import { HomeIcon } from '../../../assets/icon';


const Education = ({ data }) => {
    return (
        <div className='relative flex flex-col gap-6 py-2'>
            <h1 className='text-2xl text-yellow-800 font-bold'>EDUCATION</h1>
            <div className='flex flex-col gap-4'>
                {data?.map((edu) => (
                    <div key={edu.id} className='flex gap-2'>
                        {HomeIcon}
                        <div className='flex flex-col gap-2'>
                            <div className='text-xl font-semibold'>{edu.school_name}</div>
                            <div className='flex gap-6'>
                                <div>{edu.degree}</div>
                                <div>({edu.start_year} - {edu.end_year})</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Education;
