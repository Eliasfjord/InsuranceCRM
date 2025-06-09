import { useEffect, useState } from 'react';
import { Card, Stack, Container, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import { apiget } from '../../service/api';
import TableStyle from '../../components/TableStyle';

export default function TeamSales() {
  const { teamId } = useParams();
  const [sales, setSales] = useState([]);

  const fetchData = async () => {
    const result = await apiget(`policy/sales/team/${teamId}`);
    if (result && result.status === 200) {
      setSales(result?.data?.sales);
    }
  };

  useEffect(() => {
    fetchData();
  }, [teamId]);

  const columns = [
    { field: 'name', headerName: 'Agent', flex: 1 },
    { field: 'policies', headerName: 'Policies Sold', flex: 1 }
  ];

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Team Sales</Typography>
      </Stack>
      <TableStyle>
        <Card style={{ height: '500px', paddingTop: '15px' }}>
          <DataGrid rows={sales} columns={columns} getRowId={(row) => row.userId} />
        </Card>
      </TableStyle>
    </Container>
  );
}
