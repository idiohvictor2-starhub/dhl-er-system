const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./modules/auth/auth.routes');
const casesRoutes = require('./modules/cases/cases.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const unionRoutes = require('./modules/meetings/union.routes');
const trainingRoutes = require('./modules/training/training.routes');
const redundancyRoutes = require('./modules/redundancy/redundancy.routes');
const reportsRoutes = require('./modules/reports/reports.routes');
const aiRoutes = require('./modules/ai/ai.routes');
const alertsRoutes = require('./modules/alerts/alerts.routes');
const auditRoutes = require('./modules/audit/audit.routes');
const usersRoutes = require('./modules/users/users.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'DHL Industrial Relations Management System API' }));

app.use('/auth', authRoutes);
app.use('/cases', casesRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/union', unionRoutes);
app.use('/training', trainingRoutes);
app.use('/redundancy', redundancyRoutes);
app.use('/reports', reportsRoutes);
app.use('/ai', aiRoutes);
app.use('/alerts', alertsRoutes);
app.use('/audit', auditRoutes);
app.use('/users', usersRoutes);

app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));
app.use(errorHandler);

module.exports = app;

