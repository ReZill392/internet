async function fetchRoom() {
    try {
        const [rooms, studentResponse, equipmentsResponse] = await Promise.all([
            fetch('http://localhost:3000/data/Rooms_list_requests'),
            fetch('http://localhost:3000/data/Student_information'),
            fetch('http://localhost:3000/data/Equipments_list_information')
        ]);

        const roomsData = await rooms.json();
        const studentData = await studentResponse.json();
        const equipmentsData = await equipmentsResponse.json();

        // ตรวจสอบว่าอยู่หน้าไหน
        let statusFilter = '';

        if (window.location.pathname.includes('user_approve.html')) {
            statusFilter = 'อนุมัติ';
        } else if (window.location.pathname.includes('user_notapprove.html')) {
            statusFilter = 'ไม่อนุมัติ';
        }

        // คัดกรองตามสถานะที่กำหนด
        const mergedData = roomsData
            .filter(row => row.Requests_status === statusFilter) // ป้องกัน statusFilter เป็น undefined
            .map(row => {
                const student = studentData.find(s => s.Student_ID === row.Identify_ID) || {};
                const equipment = equipmentsData.find(e => e.Equipments_ID === row.Equipments_ID) || {};
                return {
                    ...row,
                    email: student.email || '-',
                    studentName: student.Name || '-',
                    Status:student.Status || '-',
                };
            });


        const tableBody = document.getElementById('rooms');
        tableBody.innerHTML = ''; // ล้างข้อมูลเก่า

        mergedData.forEach(row => {
            tableBody.insertAdjacentHTML("beforeend", `
                <tr>
                  <td class="text-center">${new Date(row.Submitted_time).toLocaleDateString()}</td>
                  <td class="text-center">${row.studentName}</td>
                  <td class="text-center">${row.email}</td>
                  <td class="text-center">${row.Status || '-'}</td>
                  <td class="text-center">${row.Rooms_ID || '-'}</td>
                  <td class="text-center">${row.Start_time + ' - '+ row.End_time || '-'}</td>
                  <td class="text-center">${'-'}</td>
                  <td class="text-center">${row.equipmentName || '-'}</td>
                  <td class="text-center">${row.Requests_status || '-'}</td>
                </tr>
            `);
        });
    } catch (error) {
        console.error('❌ Error fetching data:', error);
    }
}

// เรียกใRoom() เมื่อโหลดหนRoom();
fetchRoom();