package expo.modules.paymentchallange

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoPaymentChallangeModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    Name("ExpoPaymentChallange")

    Function("hello") {
      "Hello world! 👋"
    }
  }
}
