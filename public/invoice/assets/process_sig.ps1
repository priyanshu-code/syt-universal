Add-Type -AssemblyName System.Drawing

$inputPath = "C:\Users\Sayantan Paul\.gemini\antigravity\scratch\syt-receipt-editor\assets\Sayantan Sign - Director.jpeg"
$outputPath = "C:\Users\Sayantan Paul\.gemini\antigravity\scratch\syt-receipt-editor\assets\Sayantan Sign - Director.png"

if (-not (Test-Path $inputPath)) {
    Write-Error "Input file not found at $inputPath"
    exit 1
}

Write-Host "Loading image: $inputPath"
$bmp = New-Object System.Drawing.Bitmap($inputPath)
$width = $bmp.Width
$height = $bmp.Height
Write-Host "Dimensions: $width x $height"

# Create a new transparent bitmap of the exact same size
$newBmp = New-Object System.Drawing.Bitmap($width, $height)

Write-Host "Processing pixels..."
for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        
        $r = $pixel.R
        $g = $pixel.G
        $b = $pixel.B
        
        # Calculate grayscale luminance (0 to 255)
        $lum = 0.299 * $r + 0.587 * $g + 0.114 * $b
        
        # Determine if pixel is background or ink
        $isBackground = $false
        
        # In a photograph, paper background has high brightness/luminance
        if ($lum -gt 152) {
            $isBackground = $true
        }
        # Neutral color check to capture darker shaded paper edges
        elseif ($r -gt 125 -and $g -gt 125 -and $b -gt 125 -and [Math]::Abs($r - $b) -lt 25 -and [Math]::Abs($g - $b) -lt 25) {
            $isBackground = $true
        }
        
        if ($isBackground) {
            # Make the background pixel completely transparent
            $newPixel = [System.Drawing.Color]::FromArgb(0, 255, 255, 255)
        } else {
            # This is ink! Boost the blue ink color and calculate alpha dynamically
            # Alpha based on darkness (darker pixels = more opaque)
            $alpha = [int]((255 - $lum) * 1.8)
            if ($alpha -gt 255) { $alpha = 255 }
            if ($alpha -lt 0) { $alpha = 0 }
            
            # Recalculate RGB to make the blue ink pop
            # Lower red and green, boost blue relative to original
            $newR = [Math]::Min([int]($r * 0.4), 255)
            $newG = [Math]::Min([int]($g * 0.55 + 5), 255)
            $newB = [Math]::Min([int]($b * 1.1 + 40), 255)
            
            $newPixel = [System.Drawing.Color]::FromArgb($alpha, $newR, $newG, $newB)
        }
        $newBmp.SetPixel($x, $y, $newPixel)
    }
}

# Save as transparent PNG
Write-Host "Saving processed image to: $outputPath"
$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Release resources
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Signature processing completed successfully!"
