package com.ncorti.kotlin.template.library.android

import android.widget.Toast
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import android.os.Looper

/**
 * Instrumented test, which will execute on an Android device.
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@RunWith(AndroidJUnit4::class)
class ToastUtilTest {

    @Before
    fun setup() {
        // Prepare the Looper for the main thread
        if (Looper.myLooper() == null) {
            Looper.prepare()
        }
    }

    @Test
    fun showCorrectToast() {
        val context = InstrumentationRegistry.getInstrumentation().targetContext

        val toast = ToastUtil.showToast(context, "test message")

        assertNotNull("Toast should not be null", toast)
        assertEquals("Toast duration should be LENGTH_SHORT", Toast.LENGTH_SHORT, toast.duration)
    }
}
