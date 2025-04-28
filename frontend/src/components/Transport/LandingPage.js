import React from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Box, 
  Paper,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const LandingPage = () => {
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      py: 8
    }}>
      <Container maxWidth="lg">
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 4, 
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            p: { xs: 3, md: 6 }
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', mb: 2 }}>
              <LocalShippingIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: '700', 
                  background: 'linear-gradient(90deg, #2e7d32, #4caf50)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Transport Management System
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', mb: 3 }}>
              Streamline your logistics operations with our comprehensive management solution
            </Typography>
            <Divider sx={{ maxWidth: '200px', mx: 'auto', mb: 6 }} />
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {/* Driver Management Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  border: '1px solid rgba(46, 125, 50, 0.1)',
                  '&:hover': { 
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 35px rgba(46, 125, 50, 0.1)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                    py: 4,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)'
                    }} 
                  />
                  <PeopleIcon 
                    sx={{ 
                      fontSize: 80, 
                      color: 'white',
                      display: 'block',
                      mx: 'auto',
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                    }} 
                  />
                </Box>
                <CardContent sx={{ textAlign: 'center', flexGrow: 1, p: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
                    Driver Management
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Efficiently manage your driver workforce, track performance, and optimize assignments for maximum productivity.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 3, pt: 0 }}>
                  <Button 
                    component={Link} 
                    to="/drivers" 
                    variant="contained" 
                    color="primary"
                    size="large"
                    sx={{ 
                      borderRadius: 28,
                      px: 4,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: '600',
                      boxShadow: '0 4px 10px rgba(46, 125, 50, 0.3)'
                    }}
                  >
                    Manage Drivers
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Vehicle Management Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  border: '1px solid rgba(46, 125, 50, 0.1)',
                  '&:hover': { 
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 35px rgba(46, 125, 50, 0.1)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                    py: 4,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)'
                    }} 
                  />
                  <DirectionsCarIcon 
                    sx={{ 
                      fontSize: 80, 
                      color: 'white',
                      display: 'block',
                      mx: 'auto',
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                    }} 
                  />
                </Box>
                <CardContent sx={{ textAlign: 'center', flexGrow: 1, p: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
                    Vehicle Management
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Monitor vehicle status, schedule maintenance, and track performance metrics to ensure your fleet operates at peak efficiency.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 3, pt: 0 }}>
                  <Button 
                    component={Link} 
                    to="/vehicles" 
                    variant="contained" 
                    color="primary"
                    size="large"
                    sx={{ 
                      borderRadius: 28,
                      px: 4,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: '600',
                      boxShadow: '0 4px 10px rgba(46, 125, 50, 0.3)'
                    }}
                  >
                    Manage Vehicles
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Transport Management Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  border: '1px solid rgba(46, 125, 50, 0.1)',
                  '&:hover': { 
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 35px rgba(46, 125, 50, 0.1)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                    py: 4,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)'
                    }} 
                  />
                  <AssignmentIcon 
                    sx={{ 
                      fontSize: 80, 
                      color: 'white',
                      display: 'block',
                      mx: 'auto',
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                    }} 
                  />
                </Box>
                <CardContent sx={{ textAlign: 'center', flexGrow: 1, p: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', mb: 2 }}>
                    Transport Management
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Plan and execute transport operations seamlessly by assigning optimal resources to each job for maximum efficiency.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 3, pt: 0 }}>
                  <Button 
                    component={Link} 
                    to="/transport" 
                    variant="contained" 
                    color="primary"
                    size="large"
                    sx={{ 
                      borderRadius: 28,
                      px: 4,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: '600',
                      boxShadow: '0 4px 10px rgba(46, 125, 50, 0.3)'
                    }}
                  >
                    Manage Transport
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default LandingPage;
