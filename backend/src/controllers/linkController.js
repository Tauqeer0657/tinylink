import { getPool } from '../config/database.js';
import { generateShortCode } from '../utils/codeGenerator.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

// Create a new short link
export const createLink = asyncHandler(async (req, res, next) => {
  const { url, code } = req.body;
  const pool = getPool();
  
  let shortCode = code || generateShortCode();
  let attempts = 0;
  const maxAttempts = 5;
  
  while (attempts < maxAttempts) {
    try {
      const result = await pool.query(
        'INSERT INTO links (code, target_url) VALUES ($1, $2) RETURNING *',
        [shortCode, url]
      );
      
      const link = result.rows[0];
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      
      return res.status(201).json({
        code: link.code,
        shortUrl: `${baseUrl}/${link.code}`,
        targetUrl: link.target_url,
        clicks: link.clicks,
        createdAt: link.created_at
      });
      
    } catch (error) {
      // PostgreSQL unique constraint violation
      if (error.code === '23505') {
        if (code) {
          throw new ApiError(409, 'Short code already exists. Please choose a different code.');
        } else {
          shortCode = generateShortCode();
          attempts++;
        }
      } else {
        throw error;
      }
    }
  }
  
  throw new ApiError(500, 'Failed to generate unique code. Please try again.');
});

// Get all links
export const getAllLinks = asyncHandler(async (req, res) => {
  const pool = getPool();
  
  const result = await pool.query(
    'SELECT * FROM links ORDER BY created_at DESC'
  );
  
  const links = result.rows.map(link => ({
    code: link.code,
    targetUrl: link.target_url,
    clicks: link.clicks,
    lastClickedAt: link.last_clicked_at,
    createdAt: link.created_at
  }));
  
  res.status(200).json(links);
});

// Get single link stats
export const getLinkStats = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const pool = getPool();
  
  const result = await pool.query(
    'SELECT * FROM links WHERE code = $1',
    [code]
  );
  
  if (result.rows.length === 0) {
    throw new ApiError(404, 'Link not found');
  }
  
  const link = result.rows[0];
  
  res.status(200).json({
    code: link.code,
    targetUrl: link.target_url,
    clicks: link.clicks,
    lastClickedAt: link.last_clicked_at,
    createdAt: link.created_at
  });
});

// Delete a link
export const deleteLink = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const pool = getPool();
  
  const result = await pool.query(
    'DELETE FROM links WHERE code = $1 RETURNING code',
    [code]
  );
  
  if (result.rows.length === 0) {
    throw new ApiError(404, 'Link not found');
  }
  
  // Simple success message
  res.status(200).json({ 
    message: 'Link deleted successfully' 
  });
});

// Redirect to original URL
export const redirectToUrl = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const pool = getPool();
  
  const result = await pool.query(
    `UPDATE links 
     SET clicks = clicks + 1, 
         last_clicked_at = CURRENT_TIMESTAMP 
     WHERE code = $1 
     RETURNING target_url`,
    [code]
  );
  
  if (result.rows.length === 0) {
    return res.status(404).send('Link not found');
  }
  
  res.redirect(302, result.rows[0].target_url);
});
