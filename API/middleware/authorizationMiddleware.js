export const authorizeAdmin = (req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    next();
};


export const authorizeAdminOrDoctor = (req, res, next) => {
    
    const isAdmin = req.user?.role === 'ADMIN';
    const isDoctor = req.user?.role === 'DOCTOR'

    if (!isAdmin && !isDoctor) {
        return res.status(403).json({ error: 'Access denied' });
    }

    next();

};

export const authorizeUserOrAdmin = (req, res, next) => {
    const isRequiredIdSameAsLoggedId = req.user.userId === +req.params.userId
    const isAdmin = req.user?.role === 'ADMIN';

    if (!isRequiredIdSameAsLoggedId && !isAdmin) {
        return res.status(403).json({ error: 'Access denied' });
    }

    next();

};

export const authorizeUserOrDoctor = (req, res, next) => {
    

    next();

};
