
export default function RunningAverageDoubleClass(runningSize) {
    this._currentWriteIndex = 0;
    this._currentWriteCount = 0;

    this._sumCache = 0;
    this._writeArray = new Array(runningSize);
    this._varianceCache = 0;


    // Number of points
    this.GetNumCollectedPoints = function() { return this._currentWriteCount; }

    /// <summary>
    /// Add a new point into the array
    /// </summary>
    /// <param name="value"></param>
    this.AddPoint = function(value) {
        // Remove from the sum cache the oldest entry. This is quicker than calculating all ten values each time
        if ((this._currentWriteCount >= this._writeArray.length))
            this._sumCache -= this._writeArray[this._currentWriteIndex];
        this._writeArray[this._currentWriteIndex] = value;

        // Add into the sum cache the newest entry
        this._sumCache += value;

        // Increment
        this._currentWriteIndex++;

        if (this._currentWriteIndex > (this._writeArray.length - 1))
            this._currentWriteIndex = 0;
        if (this._currentWriteCount < this._writeArray.length)
            this._currentWriteCount++;

    }

    /// <summary>
    /// Get the current running average
    /// </summary>
    /// <returns></returns>
    this.GetAverage = function() {
        return (this._sumCache / this._currentWriteCount);
    }

    /// <summary>
    /// Get the variance on the current set
    /// </summary>
    /// <returns></returns>
    this.GetVariance = function() {
        var totalSquaredVariance = 0;
        var mean = this.GetAverage();
        // Rough, slow version for now
        for (var i = 0; i < this._currentWriteCount; i++)
            totalSquaredVariance += Math.pow(mean - this._writeArray[i], 2);

        return (totalSquaredVariance / (1 - this._currentWriteCount));
    }

    /// <summary>
    /// Index of dispersion normalizes over the mean
    /// </summary>
    /// <returns></returns>
    this.GetIndexOfDispersion = function() {
        return this.GetVariance() / this.GetAverage();
    }

    /// <summary>
    /// Returns the latest raw point in the running average set
    /// </summary>
    /// <returns></returns>
    this.GetLatestPoint = function() {
        if (this._currentWriteCount === 0)
            throw new Error("Attempting to get the latest raw value but none have been inserted yet");
        if (this._currentWriteIndex === 0)
            return this._writeArray[this._writeArray.length - 1];
        else
            return this._writeArray[this._currentWriteIndex - 1];
    }
}

