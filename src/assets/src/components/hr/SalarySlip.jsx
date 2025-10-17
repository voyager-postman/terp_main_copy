// src/components/SalarySlip.jsx
import React, { useRef } from "react";
import { usePDF } from 'react-to-pdf';

const SalarySlip = () => {
    const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });

    return (
        <div>
            <button onClick={() => toPDF()}>Download PDF</button>
            <div ref={targetRef} style={{marginLeft:"30px",background:"#ffff", width:"900px"}}>
                <h2>Salary Slip</h2>
                <p>Content to be generated into a PDF.</p>
                <table className="tableSlip" >
                    <tbody>
                        <tr>
                            <th>Company</th>
                            <th>Contact</th>
                            <th>Country</th>
                            <th>Country</th>
                            <th>Country</th>
                            <th>Country</th>
                            <th>Country</th>
                            <th>Country</th>
                            <th>Country</th>
                        </tr>
                        <tr>
                            <td>Alfreds Futterkiste</td>
                            <td>Maria Anders</td>
                            <td>Germany</td>
                            <td>Germany</td>
                            <td>Germany</td>
                            <td>Germany</td>
                            <td>Germany</td>
                            <td>Germany</td>
                            <td>Germany</td>
                        </tr>
                   
                    </tbody>
                </table>
            </div>
        </div>


    );
};

export default SalarySlip;
