import { useParams, useNavigate } from 'react-router-dom';
import MonthView from '../components/MonthView';

export default function MonthPage() {
  const { year, month } = useParams();
  const navigate = useNavigate();

  return (
    <MonthView
      month={Number(month)}
      year={Number(year)}
      onBack={() => navigate('/')}
    />
  );
}