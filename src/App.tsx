import { Button, Card, CardContent, Typography } from '@mui/material';

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="max-w-md">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            React + Vite + Tailwind + MUI
          </Typography>

          <Button variant="contained">
            MUI Button
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
